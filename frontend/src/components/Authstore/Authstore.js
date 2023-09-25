import { makeObservable, observable, action } from "mobx";

class AuthStore {
  isLoggedIn = false;
  constructor() {
    makeObservable(this, {
      isLoggedIn: observable,
      logintrue: action,
      loginfalse: action,
    });
  }
  logintrue() {
    this.isLoggedIn = true;
    alert(this.isLoggedIn)
  }
  loginfalse() {
    this.isLoggedIn = true;
    alert(this.isLoggedIn)
  }
}
export const store = new AuthStore();