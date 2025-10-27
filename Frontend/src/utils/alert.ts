import Swal from 'sweetalert2';
// Use prebuilt CSS to avoid requiring the SASS compiler in the project
import 'sweetalert2/dist/sweetalert2.min.css';

export const showSuccess = (title: string, text?: string) => {
  // Debug log so we can see calls in console if Swal doesn't render
  // eslint-disable-next-line no-console
  console.log('showSuccess', { title, text });
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#212842',
    allowOutsideClick: false,
    confirmButtonText: 'OK',
  }).then((res) => {
    // eslint-disable-next-line no-console
    console.log('showSuccess result', res);
    return res;
  });
};

export const showError = (title: string, text?: string) => {
  // eslint-disable-next-line no-console
  console.log('showError', { title, text });
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#212842',
    allowOutsideClick: false,
    confirmButtonText: 'OK',
  }).then((res) => {
    // eslint-disable-next-line no-console
    console.log('showError result', res);
    return res;
  });
};

export const showConfirm = (options: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#212842',
    cancelButtonColor: '#6b7280',
    confirmButtonText: options.confirmButtonText || 'Yes',
    cancelButtonText: options.cancelButtonText || 'Cancel',
  });
};

export default Swal;

// expose to window for manual testing in browser console
// if running in a browser environment, attach for debugging
try {
  // @ts-ignore
  if (typeof window !== 'undefined') window.Swal = Swal;
} catch (e) {
  // ignore
}
