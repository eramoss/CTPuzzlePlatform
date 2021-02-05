export default class User {
  name!: string
  birtyDate!: Date
  gender!: string
  email!: string
  password!: string

  birthDay: string = "";
  birthMonth: string = "";
  birthYear: string = "";

  get birthDate() {
    return `${this.birthDay}/${this.birthMonth}/${this.birthYear}`;
  }

}
