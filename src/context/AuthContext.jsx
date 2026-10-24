import { createContext, useState, useEffect } from "react";
import { getShared, setShared, getSession, setSession, subscribeToSync, recordUndoSnapshot } from "../utils/storage.js";
import { initialProperties } from "../data/properties.js";
import { defaultUsers, defaultReviews, defaultReports } from "../data/initialData.js";
import { isValidEmail } from "../utils/validators.js";
import { getPropertyPriceUnit } from "../utils/pricing.js";
import { fetchListings, registerUser, loginUser } from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(function() {
    return getSession("hire_current_user", null);
  });
  const [users, setUsers] = useState(function() {
    return getShared("hire_users", defaultUsers);
  });

  useEffect(function() {
    const existingProps = getShared("hire_properties", null);
    if (!existingProps || !Array.isArray(existingProps) || existingProps.length < 50) {
      setShared("hire_properties", initialProperties, true);
    }

    async function syncBackendData() {
      try {
        const res = await fetchListings();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const merged = res.data.map(p => ({
            ...p,
            id: Number(p.id) || p.id,
            priceUnit: p.type === 'Restaurant' ? '/ meal' : '/ night',
            image: "",
            images: []
          }));
          setShared("hire_properties", merged, true);
        }
      } catch (err) {}
    }
    syncBackendData();

    if (!localStorage.getItem("hire_users")) setShared("hire_users", defaultUsers, false);
    if (!localStorage.getItem("hire_reviews")) setShared("hire_reviews", defaultReviews, false);
    if (!localStorage.getItem("hire_bookings")) setShared("hire_bookings", [], false);
    if (!localStorage.getItem("hire_reports_cleared_v1")) {
      setShared("hire_reports", [], true);
      localStorage.setItem("hire_reports_cleared_v1", "true");
    } else if (!localStorage.getItem("hire_reports")) {
      setShared("hire_reports", defaultReports, false);
    }
  }, []);

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const freshUsers = getShared("hire_users", defaultUsers);
      setUsers(freshUsers);

      const sessionUser = getSession("hire_current_user", null);
      if (sessionUser && sessionUser.email) {
        const found = freshUsers.find(function(u) {
          return u.email.toLowerCase() === sessionUser.email.toLowerCase();
        });
        if (found) {
          if (found.isBanned) {
            setCurrentUserState(null);
            sessionStorage.removeItem("hire_current_user");
          } else if (found.isApproved !== sessionUser.isApproved || found.role !== sessionUser.role) {
            const merged = { ...sessionUser, isApproved: found.isApproved, role: found.role };
            setCurrentUserState(merged);
            setSession("hire_current_user", merged);
          }
        }
      }
    });

    return unsubscribe;
  }, []);

  function saveUsers(updatedUsers) {
    setUsers(updatedUsers);
    setShared("hire_users", updatedUsers);
  }

  function setCurrentUser(user) {
    setCurrentUserState(user);
    if (user) {
      setSession("hire_current_user", user);
    } else {
      sessionStorage.removeItem("hire_current_user");
    }
  }

  async function login(email, password) {
    const cleanEmail = String(email).trim().toLowerCase();

    try {
      const apiRes = await loginUser({ email: cleanEmail, password });
      if (apiRes.success && apiRes.data) {
        const u = {
          name: apiRes.data.name,
          email: apiRes.data.email,
          role: apiRes.data.role,
          isBanned: apiRes.data.status === 'Suspended',
          _id: apiRes.data._id
        };
        setCurrentUser(u);
        return { success: true, user: u };
      }
    } catch (e) {}

    const currentUsersList = getShared("hire_users", users);
    let matched = currentUsersList.find(function(u) { return u.email.toLowerCase() === cleanEmail; });

    if (matched && matched.isBanned) {
      return { success: false, message: "This account has been banned by the administrator." };
    }
    if (matched) {
      const exactMatch = matched.password && matched.password === password;
      if (!exactMatch) {
        return { success: false, message: "Invalid password." };
      }
      setCurrentUser(matched);
      return { success: true, user: matched };
    }
    return { success: false, message: "Invalid password." };
  }

  function loginAsPropertyManager(property, password) {
    const slug = (property.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const hotelNamePass = `${slug}@123`;
    const isValid = password === "hotel@123" || password === hotelNamePass || (property.password && password === property.password);
    if (!isValid) {
      return { success: false, message: "Invalid password." };
    }
    const mgrUser = {
      name: `${property.name} Manager`,
      email: property.managerEmail || `manager_${property.id}@hire.com`,
      role: "manager",
      propertyId: property.id,
      isBanned: false
    };
    setCurrentUser(mgrUser);
    return { success: true, user: mgrUser };
  }

  function logout() {
    setCurrentUser(null);
  }

  async function signup(data) {
    const cleanEmail = String(data.email).trim().toLowerCase();
    const currentUsersList = getShared("hire_users", users);
    const exists = currentUsersList.find(function(u) { return u.email.toLowerCase() === cleanEmail; });
    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }
    const isCritic = data.role === "critic";
    const newUser = {
      name: data.name,
      email: cleanEmail,
      password: data.password,
      role: data.role || "customer",
      propertyId: data.propertyId || (data.role === "manager" ? 1 : null),
      licenceNumber: isCritic ? (data.licenceNumber || "") : null,
      isApproved: isCritic ? false : true,
      isBanned: false
    };

    try {
      await registerUser({
        name: data.name,
        email: cleanEmail,
        password: data.password,
        role: data.role || "customer"
      });
    } catch (e) {}

    const nextUsers = [...currentUsersList, newUser];
    saveUsers(nextUsers);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  function updateUser(updatedUser) {
    const nextUsers = getShared("hire_users", users).map(function(u) {
      return u.email.toLowerCase() === updatedUser.email.toLowerCase() ? { ...u, ...updatedUser } : u;
    });
    saveUsers(nextUsers);
    if (currentUser && currentUser.email.toLowerCase() === updatedUser.email.toLowerCase()) {
      setCurrentUser({ ...currentUser, ...updatedUser });
    }
  }

  function banUser(email, banStatus) {
    const prevUsers = getShared("hire_users", users);
    recordUndoSnapshot(`${banStatus ? "Banned" : "Unbanned"} user ${email}`, { users: prevUsers });

    const nextUsers = prevUsers.map(function(u) {
      return u.email.toLowerCase() === email.toLowerCase() ? { ...u, isBanned: banStatus } : u;
    });
    saveUsers(nextUsers);
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase() && banStatus) {
      logout();
    }
  }

  function approveCritic(email, approveStatus) {
    const prevUsers = getShared("hire_users", users);
    recordUndoSnapshot(`${approveStatus ? "Approved" : "Revoked"} critic ${email}`, { users: prevUsers });

    const nextUsers = prevUsers.map(function(u) {
      return u.email.toLowerCase() === email.toLowerCase() ? { ...u, isApproved: approveStatus, status: approveStatus ? "Approved" : "Pending Approval" } : u;
    });
    saveUsers(nextUsers);
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setCurrentUser({ ...currentUser, isApproved: approveStatus, status: approveStatus ? "Approved" : "Pending Approval" });
    }
  }

  function changeUserStatus(email, newStatus) {
    const prevUsers = getShared("hire_users", users);
    const nextUsers = prevUsers.map(function(u) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const isValid = newStatus !== "Flagged" && newStatus !== "Suspended" && newStatus !== "Banned";
        return { ...u, status: newStatus, valid: isValid };
      }
      return u;
    });
    saveUsers(nextUsers);
  }

  const value = {
    currentUser,
    users,
    login,
    loginAsPropertyManager,
    logout,
    signup,
    updateUser,
    banUser,
    approveCritic,
    changeUserStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
