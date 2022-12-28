import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [didSent, setDidSent] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsOrdering(true);
  };

  const confirmOrderHandler = async (userData) => {
    setIsSending(true);
    await fetch(
      "https://react-http-a1aec-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedMeals: cartCtx.items,
        }),
      }
    );

    setIsSending(false);
    setDidSent(true);
    
    //clearing cartItems after sending to database
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modelActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button onClick={orderHandler} className={classes.button}>
          Order
        </button>
      )}
    </div>
  );

  const modelCartContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isOrdering && (
        <Checkout onConfirm={confirmOrderHandler} onCancel={props.onClose} />
      )}
      {!isOrdering && modelActions}
    </React.Fragment>
  );

  const successfullOrder = <React.Fragment>
      <p>Order places successfully. Order will be served in 30 minutes</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
  </React.Fragment>

  return <Modal onClose={props.onClose}> 
    {!isSending && !didSent && modelCartContent}
    {isSending && <p>Sending..</p>}
    {!isSending && didSent && successfullOrder }
  </Modal>;
};

export default Cart;
