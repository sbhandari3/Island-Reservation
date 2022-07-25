// Function that adds commas to numbers, used in multiple parts of frontend
export default function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}