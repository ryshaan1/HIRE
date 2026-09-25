import { createContext, useState, useEffect } from "react";
import { getShared, setShared, getSession, setSession, subscribeToSync, recordUndoSnapshot } from "../utils/storage.js";
import { initialProperties } from "../data/properties.js";
import { defaultUsers, defaultReviews, defaultReports } from "../data/initialData.js";
import { isValidEmail, isValidDemoPassword, getHotelDemoPassword } from "../utils/validators.js";
import { getPropertyPriceUnit } from "../utils/pricing.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(function() {
    return getSession("hire_current_user", null);
  });
  const [users, setUsers] = useState(function() {
    return getShared("hire_users", defaultUsers);
  });

  // Ensure default data exists with updated rate units and properties
  useEffect(function() {
    const existingProps = getShared("hire_properties", null);
    if (!existingProps || !Array.isArray(existingProps) || existingProps.length === 0) {
      setShared("hire_properties", initialProperties, false);
    } else {
      // Ensure existing cached properties have priceUnit assigned
      let migrated = false;
      const verified = existingProps.map(function(p) {
        if (!p.priceUnit) {
          migrated = true;
          return { ...p, priceUnit: getPropertyPriceUnit(p) };
        }
        return p;
      });
      if (migrated) {
        setShared("hire_properties", verified, false);
      }
    }

    if (!localStorage.getItem("hire_users")) setShared("hire_users", defaultUsers, false);
    if (!localStorage.getItem("hire_reviews")) setShared("hire_reviews", defaultReviews, false);
    if (!localStorage.getItem("hire_bookings")) setShared("hire_bookings", [], false);
    if (!localStorage.getItem("hire_reports")) setShared("hire_reports", defaultReports, false);
  }, []);

  // Listen to cross-tab updates to sync user status and approval
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

  function login(email, password) {
    const cleanEmail = String(email).trim().toLowerCase();
    const currentUsersList = getShared("hire_users", users);
    let matched = currentUsersList.find(function(u) { return u.email.toLowerCase() === cleanEmail; });

    if (matched && matched.isBanned) {
      return { success: false, message: "This account has been banned by the administrator." };
    }
    if (matched) {
      const demoValid = isValidDemoPassword(cleanEmail, password);
      const exactMatch = matched.password && matched.password === password;
      if (!demoValid && !exactMatch) {
        return { success: false, message: "Invalid password for this account." };
      }
      setCurrentUser(matched);
      return { success: true, user: matched };
    }
    if (isValidEmail(cleanEmail) && isValidDemoPassword(cleanEmail, password)) {
      const newUser = { name: cleanEmail.split("@")[0], email: cleanEmail, role: "customer", isBanned: false };
      const nextUsers = [...currentUsersList, newUser];
      saveUsers(nextUsers);
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }
    return { success: false, message: "Invalid email or demo password format (prefix@123)." };
  }

  function loginAsPropertyManager(property, password) {
    const expected = getHotelDemoPassword(property.name);
    if (password !== expected && password !== "manager@123") {
      return { success: false, message: `Invalid password. Expected first 3 letters + @123 (e.g. ${expected})` };
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

  function signup(data) {
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
      return u.email.toLowerCase() === email.toLowerCase() ? { ...u, isApproved: approveStatus } : u;
    });
    saveUsers(nextUsers);
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setCurrentUser({ ...currentUser, isApproved: approveStatus });
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, users, login, loginAsPropertyManager, logout, signup, updateUser, banUser, approveCritic }}>
      {children}
    </AuthContext.Provider>
  );
}
