interface User {
    name: string;
    age: number;
}

function saveUserToDatabase(user: User) {
    console.log(user);
}

saveUserToDatabase({ name: 'John', age: 42 });
