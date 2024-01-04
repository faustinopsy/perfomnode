import db from '../Database/database.js';

class Mega {
    constructor(num1, num2, num3, num4, num5, num6) {
        this.num1 = num1;
        this.num2 = num2;
        this.num3 = num3;
        this.num4 = num4;
        this.num5 = num5;
        this.num6 = num6;
    }

    save() {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Mega (num1, num2, num3, num4, num5, num6) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(query, [this.num1, this.num2, this.num3, this.num4, this.num5, this.num6], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }
}

export default Mega;
