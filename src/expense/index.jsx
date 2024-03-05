import React, { useEffect, useState } from 'react';
import Header from "../components/header";
import './expense.css';
import Expenses from '../firebaseAPI/expense';
import { toast, ToastContainer } from 'react-toastify';
import Leftpanel from '../components/panel';

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform submission logic here
        console.log("Expense:", expense);
        console.log("Type:", type);
        console.log("Category:", category);
        console.log("Remark:", remark);
        console.log("Is Split:", isSplit);
    
        try {
            let am = expense;
            // If split is true, divide the expense equally among all recipients
            if (isSplit) {
                // Calculate the total number of recipients (current user + emails in the list)
                const totalRecipients = emailsList.length + 1;
    
                // Calculate the amount per recipient
                am = expense / totalRecipients;
    
                // Add expense for each email in the list
                for (const email of emailsList) {
                    const ouid = await expenses.getUid(email);
                    console.log(email, ouid);
                    await expenses.addExpense(type, am, category, remark, ouid);
                }
            }
    
            // Add expense for the current user
            await expenses.addExpense(type, am, category, remark, null);
    
            // Reset form fields and show success message
            setExpense('');
            setType('');
            setCategory('');
            setRemark('');
            setIsSplit(false);
            setEmail('');
            setEmailsList([]);
            toast.success("Expense added");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };
    

    // Function to handle adding email on Enter press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email.trim() !== '') {
            e.preventDefault();
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
            <div style={{ display: 'flex' }}>
                <Leftpanel />
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
            </div>
            <ToastContainer />
        </div>
    );
}

export default Expense;
