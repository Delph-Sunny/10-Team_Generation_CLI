// Manager class: inherit from Employee + officeNumber
const Employee = require("./Employee");

class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        //TO DO: CHECK FOR VALID NUMBER FORMAT
        this.officeNumber = officeNumber;        
    }
    
    getOfficeNumber() {
        return this.officeNumber;
    }

    getRole() {
        return "Manager";
    }
}

module.exports = Manager;