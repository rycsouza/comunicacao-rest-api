export default async (miliseconds: number) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, miliseconds)
  })
}
