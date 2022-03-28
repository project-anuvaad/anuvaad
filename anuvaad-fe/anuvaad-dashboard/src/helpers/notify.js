import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 5000,
  draggable: false,
  position: toast.POSITION.TOP_CENTER
});

class Notify {
  static success(message) {
    toast.success(message);
  }

  static error(message) {
    toast.error(message);
  }
}

export default Notify;
