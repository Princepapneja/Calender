import Swal from "sweetalert2";

export const confirmToast = async (title = "", text = "Are you sure you want to do this?", confirmButtonText) => {
    const result = await Swal.fire({
        title,
        text,
        confirmButtonText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    });
    // console.log("result: ", result);
    // console.log("result?.isConfirmed: ", result?.isConfirmed);
    return result?.isConfirmed
}
export const toast = async (timer, text = 'Done', timerProgressBar = true, showConfirmButton = false, icon = "success") => {
    await Swal.fire({
        timer,
        text,
        timerProgressBar,
        showConfirmButton,
        icon,
        
    });
} 