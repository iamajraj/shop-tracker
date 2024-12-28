## Shop POS system to store/track the Products and Sold Products | Written in NodeJS and JavaScript using HTTP module | No Additional Libraries
*`The funny part about not using additional libraries is that 'the government had shut down the internet in our country' 🙂`*

For the Database I've written a simple JSON Database class which stores the data to json file in local file system.

API:
```
   /                 // GET
   /status           // GET
   /insert-sale      // POST
   /sold-products    // GET
   /insert-product   // POST
   /update-product   // PUT
   /products         // GET
   /get-products     // GET
```
