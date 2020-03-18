export default function(name) {
  return `${process.env.APP_URL}/files/${name}?t=${new Date().getTime()}`;
}
