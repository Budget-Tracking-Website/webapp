import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getDatabase, ref, child, get, push, serverTimestamp, set, orderByChild, orderByKey, orderByValue } from "firebase/database";
import Authentication from "./authentication";

class Expenses {
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
        this.auth = new Authentication();
    }

    getCategories() {
        return new Promise((resolve, reject) => {
            const dbRef = ref(this.db);
            get(child(dbRef, `admin/categories`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const categoriesObject = snapshot.val();
                    const categoriesArray = Object.values(categoriesObject);
                    resolve(categoriesArray);
                } else {
                    resolve([]);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    modifyTotal(uid, type, amount) {
        console.log(uid, type, amount);
        return new Promise((resolve, reject) => {
            let expensesRef = ref(this.db, `userdata/${uid}`);
            let rref = ref(this.db, `userdata/${uid}/credited`);
            let fg = child(expensesRef, "credited");
            if (type === "debited") {
                fg = child(expensesRef, "debited");
                rref = ref(this.db, `userdata/${uid}/debited`);
            }
            try {
                get(fg).then((snapshot) => {
                    let am = snapshot.val() || 0; // Initialize am to 0 if snapshot value is null
                    const ss = parseFloat(am);
                    var updatedAmount = ss + parseFloat(amount);
                    // Convert updatedAmount to a number
                    const numericAmount = parseFloat(updatedAmount);
                    console.log(am, ss, amount, updatedAmount, numericAmount);
                    set(rref, numericAmount)
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }).catch((error) => {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
    



    addExpense(type, amount, category, remark, ouid) {
        const uid = this.auth.getUid();
        const expenseMap = {
            addedBy: uid,
            type: type,
            amount: amount,
            category: category,
            time: serverTimestamp(),
            remark: remark,
            expenseBy: ouid
        };
        if (ouid == null) {
            expenseMap['expenseBy'] = uid;
        }
        console.log(expenseMap);
        return new Promise((resolve, reject) => {
            const expensesRef = ref(this.db, `expenses/${expenseMap['expenseBy']}`);

            const pushed = push(expensesRef);
            set(pushed, expenseMap)
                .then(() => {
                    this.modifyTotal(expenseMap['expenseBy'], type, amount).then(() => {
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getUid(email) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(this.db);
            const usersRef = child(dbRef, 'users');
            get(usersRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val() === email) {
                            resolve(childSnapshot.key); // Return the key if email matches
                        }
                    });
                    // If no matching email found after iterating through all children
                    resolve(null);
                } else {
                    // If no data exists under 'users'
                    resolve(null);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    getAllTransactions() {
        return new Promise((resolve, reject) => {
            const dbRef = ref(this.db);
            const userId = this.auth.getUid();
            get(child(dbRef, `expenses/${userId}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const transactions = snapshot.val();
                    const transactionList = Object.keys(transactions).map(key => ({
                        id: key,
                        ...transactions[key]
                    }));
                    resolve(transactionList);
                } else {
                    resolve([]); // Return an empty array if no data available
                }
            }).catch((error) => {
                reject(error);
            })
        })
    }

    getUserSaving() {
        return new Promise((res, reject) => {            
            const uid = this.auth.getUid();
            let expensesRef = ref(this.db, `userdata/${uid}`);
            let fg = child(expensesRef, "credited");
            get(fg).then((snapshot) => {
                let am = snapshot.val() || 0;
                res(am);
            }).catch((e) => {
                reject(e);
            })
        })
    }

    getUserExpense() {
        return new Promise((res, reject) => {            
            const uid = this.auth.getUid();
            let expensesRef = ref(this.db, `userdata/${uid}`);
            let fg = child(expensesRef, "debited");
            get(fg).then((snapshot) => {
                let am = snapshot.val() || 0;
                res(am);
            }).catch((e) => {
                reject(e);
            })
        })
    }
    
}




export default Expenses;