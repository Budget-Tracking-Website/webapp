import { getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { toast } from "react-toastify";

class Authentication {
    constructor() {
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth();
        this.provider.addScope('https://www.googleapis.com/auth/cloud-platform.read-only');
        this.auth.useDeviceLanguage();
        this.user = this.auth.currentUser; // Get current user on initialization
        this.isSignedIn = !!this.user; // Initialize as signed in if there's a user
    }

    getUserEmail() {
        return this.user ? this.user.email : null;
    }

    getUserName() {
        return this.user ? this.user.displayName : null;
    }

    getIsEmailVerified() {
        return this.user ? this.user.emailVerified : null;
    }

    getUid() {
        return this.user ? this.user.uid : null;
    }

    sendPasswordResetEmail(em) {
        return new Promise((res, reject) => {
            sendPasswordResetEmail(this.auth, em)
                .then(() => {
                    res();
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }
    logout() {
        return new Promise((resolve, reject) => {
            signOut(this.auth)
                .then(() => {
                    this.user = null;
                    this.isSignedIn = false;
                    console.log("User logged out");
                    resolve();
                })
                .catch((error) => {
                    // console.error("Logout Error:", error);
                    reject(error);
                });
        });
    }

    sendVerificationEmail() {
        return new Promise((resolve, reject) => {
            sendEmailVerification(this.auth.currentUser)
                .then(() => {
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
        })
    }
    createUser(email, password, name) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(this.auth, email, password)
                .then(async (userCredential) => {
                    this.user = userCredential.user;
                    this.isSignedIn = !!this.user;
                    try {
                        const auth = getAuth();
                        await updateProfile(auth.currentUser, {
                            displayName: name,
                        });
                        // Profile updated!
                        // Further actions after profile update...
                    } catch (error) {
                        // An error occurred
                        console.error("Error updating profile:", error);
                    }
                    this.sendVerificationEmail().then(() => {
                        const db = getDatabase();
                        set(ref(db, `users/${this.user.uid}`), email)
                            .then(() => {
                                this.logout().then(() => {
                                    toast.info("Account created, verify your email using link sent on your email");
                                    resolve();
                                }).catch((e) => {
                                    reject(e);
                                });
                            }).catch((e) => {
                                reject(e);
                            });
                    }).catch((e) => {
                        reject(e);
                    });
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    reject(errorMessage);
                });
        });
    }

    signInUser(email, password) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password)
                .then((userCredential) => {
                    this.user = userCredential.user;
                    this.isSignedIn = !!this.user;
                    console.log('logged in');
                    if (this.user.emailVerified) {
                        resolve(true);
                    }
                    else {
                        console.log('verifying email sending');
                        this.sendVerificationEmail().then(() => {
                            console.log('logging out');
                            this.logout().then(() => {
                                resolve(false);
                            }).catch((e) => {
                                reject(e);
                            });
                        }).catch((e) => {
                            reject(e);
                        })
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    reject(errorMessage);
                });
        });
    }

    getAccess() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(this.auth, (user) => {
                this.user = user;
                this.isSignedIn = !!user;
                if (this.isSignedIn) {
                    resolve(user);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    getIsSignedIn() {
        return this.isSignedIn;
    }
}

export default Authentication;
