import React, { useEffect, useState } from 'react';
import Header from "../components/header";
import './expense.css';
import Expenses from '../firebaseAPI/expense';
import { toast, ToastContainer } from 'react-toastify';

function Expense() {
    // State variables for expense details
    const [expense, setExpense] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [remark, setRemark] = useState('');
    const [isSplit, setIsSplit] = useState(false);
    const [email, setEmail] = useState('');
    const [emailsList, setEmailsList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const expenses = new Expenses();

    useEffect(() => {

        expenses.getCategories()
            .then(categories => {
                setCategoryList(categories);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);


    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform submission logic here
        console.log("Expense:", expense);
        console.log("Type:", type);
        console.log("Category:", category);
        console.log("Remark:", remark);
        console.log("Is Split:", isSplit);

        let am = expense;
        if (isSplit) {   
            am = expense / (emailsList.length + 1);
        }            
        expenses.addExpense(type, am, category, remark, null).then(() => {

            if(isSplit){
                Promise.all(
                    emailsList.map(element => {
                        return expenses.getUid(element).then((ouid) => {
                            return expenses.addExpense(type, am, category, remark, ouid);
                        }).catch((e) => {
                            toast.error(e);
                        });
                    })).then(() => {
                        setExpense('');
                        setType('');
                        setCategory('');
                        setRemark('');
                        setIsSplit(false);
                        setEmail('');
                        setEmailsList([]);
                        toast.success("Expenses added");
                    });
            }
            else{
            setExpense('');
            setType('');
            setCategory('');
            setRemark('');
            setIsSplit(false);
            setEmail('');
            setEmailsList([]);
            toast.success("Expense added");
            }
        }).catch((e) => {
            console.error(e);
            toast.error(e);
        });
    };


    // Function to handle adding email on Enter press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email.trim() !== '') {
            setEmailsList([...emailsList, email.trim()]);
            setEmail('');
        }
    };

    // Function to handle removing email from the list
    const handleRemoveEmail = (index) => {
        const updatedEmailsList = emailsList.filter((_, i) => i !== index);
        setEmailsList(updatedEmailsList);
    };

    return (
        <div>
            <Header title={"Add Expense"} />
            <form className='form-container' onSubmit={handleSubmit}>
                <label>
                    <div className='head'>
                        Amount
                    </div>
                    <input type='number' value={expense} onChange={(e) => setExpense(e.target.value)} required />
                </label>
                <br />
                <label>
                    <div className='head'>
                        Type
                    </div>
                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="credited">Credited</option>
                        <option value="debited">Debited</option>
                    </select>
                </label>
                <br />
                <label>
                    <div className='head'>
                        Category:
                    </div>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categoryList.map((categoryItem, index) => (
                            <option key={index} value={categoryItem}>{categoryItem}</option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    <div className='head'>
                        Remark:
                    </div>
                    <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />
                </label>
                <br />
                <label>
                    <div className='head' style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between', alignItems: 'baseline', flexwrap: 'wrap' }}>
                        Split evenly with others?
                        <input type="checkbox" checked={isSplit} onChange={(e) => setIsSplit(e.target.checked)} />
                    </div>
                </label>
                {isSplit && (
                    <>
                        <label>
                            <div className='head'>
                                Enter emails:
                            </div>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeyPress} />
                        </label>
                        <div>
                            {emailsList.map((email, index) => (
                                <div key={index} className="email-box">
                                    {email}
                                    <button type="button" onClick={() => handleRemoveEmail(index)}>&times;</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Expense;
