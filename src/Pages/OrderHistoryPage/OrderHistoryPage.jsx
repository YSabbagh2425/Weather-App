import * as usersService from '../../Utilities/users-service';

function OrderHistoryPage() {
  async function handleCheckToken() {
    const expDate = await usersService.checkToken();
    console.log(expDate);
  };

  return (
    <>
      <h1>Order History Page</h1>
      <button onClick={handleCheckToken}>Check When My Login Expires</button>
    </>
  );
};

export default OrderHistoryPage;