import "./Categories.css"; // Don't forget to import the CSS!
import EditTransaction from "../EditTransaction";
import { useTransactions } from "../Context/TransactionContext";
import { useState } from "react";
import GroupCategories from "./GroupCategories";

const Categories = () => {

    const { transaction, categories, deleteTransaction, updateText } = useTransactions();

    return (
        <>
            <div className="categories-wrapper">
                {categories.map((category) => {
                    const filteredTransaction = transaction.filter((item) => item.category === category);
                    const expense = filteredTransaction.reduce((acc, item) => acc + item.money,0);

                    return (
                        <GroupCategories
                            key={category}
                            category={category}
                            transactions={filteredTransaction}
                            expense={expense}
                            deleteTransaction={deleteTransaction}
                            updateText={updateText}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Categories;