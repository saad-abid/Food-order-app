import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = value => value.trim() === "";
const isFiveChars = value => value.trim().length === 5;

const Checkout = (props) => {
    const nameRef = useRef();
    const streetRef = useRef();
    const postalCodeRef = useRef();
    const cityRef = useRef();

    const [formValidity, setFormValidity] = useState({
        name: true,
        street: true,
        postalCode: true,
        city: true
    })

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredStreet = streetRef.current.value;
    const enteredPostalcode = postalCodeRef.current.value;
    const enteredCity = cityRef.current.value;

    const nameIsValid = !isEmpty(enteredName);
    const streetIsValid = !isEmpty(enteredStreet);
    const cityIsValid = !isEmpty(enteredCity);
    const postalcodeIsValid = isFiveChars(enteredPostalcode);
    const formIsValid = nameIsValid && streetIsValid && cityIsValid && postalcodeIsValid;

    setFormValidity({
        name: nameIsValid,
        street: streetIsValid,
        postalCode: postalcodeIsValid,
        city: cityIsValid
    })

    if(!formIsValid){
        return;
    }

    //sending data back to cart js where it is sent to data base with orderd items
    props.onConfirm({
        name: enteredName,
        street: enteredCity,
        postalcode: enteredPostalcode,
        city: enteredCity, 
    })
  };

  const nameInputClasses =  `${classes.control} ${formValidity.name ? '' : classes.invalid }`;
  const streetInputClasses =  `${classes.control} ${formValidity.street ? '' : classes.invalid }`;
  const postalCodeInputClasses =  `${classes.control} ${formValidity.postalCode ? '' : classes.invalid }`;
  const cityInputClasses =  `${classes.control} ${formValidity.city ? '' : classes.invalid }`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name"  ref={nameRef}/>
        {!formValidity.name && <p className={classes.errorMessage}>please enter valid Name</p>}
      </div>
      <div className={streetInputClasses}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetRef} />
        {!formValidity.street && <p className={classes.errorMessage}>please enter valid street</p>}
      </div>
      <div className={postalCodeInputClasses}>
        <label htmlFor="pc">Postal Code</label>
        <input type="text" id="pc" ref={postalCodeRef} />
        {!formValidity.postalCode && <p className={classes.errorMessage}>postal code must be 5 digit long</p>}

      </div>
      <div className={cityInputClasses}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityRef} />
        {!formValidity.city && <p className={classes.errorMessage}>please enter valid city</p>}
      </div>
      <div className={classes.actions}>
        <button onClick={props.onCancel} type="button">
          Cancel
        </button>
        <button>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
