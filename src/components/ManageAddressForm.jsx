import React, { useEffect, useState } from 'react';
import Styles from '../pages/Profile.module.css';
import Button from './UI/Button';
import { updateUser } from '../apis/api';
import { toast } from 'react-toastify';

const ManageAddressForm = ({
  addressIndex,
  parentUser,
  modalHandler,
  fetchUser
}) => {
  const [user, setUser] = useState(parentUser);

  const inputChangeHandler = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  const updateUserProfile = async () => {
    const response = await updateUser(user._id, user);
    if (response.status === 200) {
      toast.success('Address Saved Successfully');
      modalHandler();
      fetchUser();
    } else {
      toast.error('Something went wrong');
    }
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <form
      action=""
      className="flex flex-col gap-2"
      onSubmit={(e) => submitFormHandler(e)}
    >
      <div className="">
        <label htmlFor="">Shipping Address* </label>
        <textarea
          rows="2"
          type="text"
          value={
            user[`shippingaddress${addressIndex}`]
              ? user[`shippingaddress${addressIndex}`]
              : ''
          }
          placeholder="House no. | Street | Landmark | City | State"
          className="mt-1 shadow-sm focus:border-primary border rounded-md p-[10px] w-full resize-none focus:ring-primary"
          onChange={(e) =>
            inputChangeHandler(`shippingaddress${addressIndex}`, e.target.value)
          }
          required
        />
      </div>
      <div className="flex flex-col items-start">
        <label htmlFor="">Shipping Pincode* </label>
        <input
          type="number"
          value={
            user[`shippingpincode${addressIndex}`]
              ? user[`shippingpincode${addressIndex}`]
              : ''
          }
          placeholder="pincode"
          className="border rounded-md h-[40px] w-full px-[10px] mt-1 shadow-sm focus:border-primary focus:ring-primary"
          onChange={(e) =>
            inputChangeHandler(`shippingpincode${addressIndex}`, e.target.value)
          }
          required
        />
      </div>
      <div className="flex flex-col mt-1">
        <label htmlFor="">Billing Name* </label>
        <input
          type="text"
          value={
            user[`billingname${addressIndex}`]
              ? user[`billingname${addressIndex}`]
              : ''
          }
          placeholder="Billing Name"
          className="border rounded-md h-[40px] px-[10px] mt-1 shadow-sm focus:border-primary focus:ring-primary"
          onChange={(e) =>
            inputChangeHandler(`billingname${addressIndex}`, e.target.value)
          }
          required
        />
      </div>
      <div className="">
        <div className="flex w-full justify-between items-start">
          <label htmlFor="">Billing Address* </label>
          <p className={`text-xs text-slate-500 flex`}>
            <input
              type="checkbox"
              className="mr-2"
              onChange={(e) => {
                if (e.target.checked) {
                  setUser({
                    ...user,
                    [`billingaddress${addressIndex}`]:
                      user[`shippingaddress${addressIndex}`],
                    [`billingpincode${addressIndex}`]:
                      user[`shippingpincode${addressIndex}`]
                  });
                } else {
                  setUser({
                    ...user,
                    [`billingaddress${addressIndex}`]: '',
                    [`billingpincode${addressIndex}`]: ''
                  });
                }
              }}
              //   disabled={user[`shippingaddress${addressIndex}`]}
            />
            Same as shipping address
          </p>
        </div>
        <textarea
          rows="2"
          type="text"
          value={
            user[`billingaddress${addressIndex}`]
              ? user[`billingaddress${addressIndex}`]
              : ''
          }
          placeholder="House no. | Street | Landmark | City | State"
          className="mt-1 shadow-sm focus:border-primary border rounded-md p-[10px] w-full resize-none focus:ring-primary"
          onChange={(e) =>
            inputChangeHandler(`billingaddress${addressIndex}`, e.target.value)
          }
          required
        />
      </div>
      <div className="flex flex-col items-start">
        <label htmlFor="">Billing Pincode* </label>
        <input
          type="number"
          value={
            user[`billingpincode${addressIndex}`]
              ? user[`billingpincode${addressIndex}`]
              : ''
          }
          placeholder="pincode"
          className="border rounded-md w-full h-[40px] px-[10px] mt-1 shadow-sm focus:border-primary focus:ring-primary"
          onChange={(e) =>
            inputChangeHandler(`billingpincode${addressIndex}`, e.target.value)
          }
          required
        />
      </div>
      <Button
        value="Submit"
        className={`w-max ${Styles.button}`}
        type="submit"
      />
    </form>
  );
};

export default ManageAddressForm;
