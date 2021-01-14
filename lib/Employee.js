// Employee class containing name, id, email
class Employee {
    constructor(name, id, email) {
        /* a set of errors in case the basic answers are not given:
        NOT WORKING WITH UNIT TESTS

        if (!name) {
            throw new Error("You are missing the name.");
        }
        if (!id) {
            throw new Error("You are missing the id.");
        }
        if (!email) {
            throw new Error("You are missing the email.");
        }
*/
        this.name = name;
        this.id = id;
        this.email = email;
        // TO CHECK: no this.role
    }

    getName() {
        return this.name;
    }
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getRole() {
        return "Employee";
    }
}

module.exports = Employee;