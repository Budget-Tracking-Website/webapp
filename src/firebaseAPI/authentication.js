import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

    logout() {
        return new Promise((resolve, reject) => {
            this.logg.addLog(this.user.email, `Logged out`, '');
            signOut(this.auth)
                .then(() => {
                    this.user = null;
                    this.isSignedIn = false;
                    // console.log("User logged out");
                    resolve();
                })
                .catch((error) => {
                    // console.error("Logout Error:", error);
                    reject(error);
                });
        });
    }

    getAccess() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(this.auth, (user) => {
                this.user = user;
                this.isSignedIn = !!user;
                if(this.isSignedIn){
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
