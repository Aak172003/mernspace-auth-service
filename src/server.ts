function welcomeMessage(name: string) {
    const user = {
        name: "Aakash",
        age: 20,
        email: "aakash@gmail.com",
    };

    // This give error because i defiend if to access keys inside object provide error
    /*
     9:22  error  ["name"] is better written in dot notation   dot-notation
    10:22  error  ["age"] is better written in dot notation    dot-notation
    11:22  error  ["email"] is better written in dot notation  dot-notation

    This below is giver error 
    console.log(user["name"]);
    console.log(user["age"]);
    console.log(user["email"]);
    */
    console.log(user.name);
    console.log(user.age);
    console.log(user.email);

    console.log(`Welcome to the Full Stack Development Project ${name}`);
}

console.log("Hello World");

welcomeMessage("Aakash");
