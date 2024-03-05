import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getDatabase, ref, child, get, push, serverTimestamp, set, orderByChild } from "firebase/database";
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
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getUid(email) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(this.db);
            const query = orderByChild(child(dbRef, 'users')).equalTo(email);
            get(query).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        resolve(childSnapshot.key); // Return the key if email matches
                    });
                } else {
                    resolve(null); // If no matching email found
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }
}




export default Expenses;