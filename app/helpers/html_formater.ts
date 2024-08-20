interface HTMLFormaterInterface {
  htmlTemplate: string
  params: { [key: string]: string } | object
}

export default ({ htmlTemplate, params }: HTMLFormaterInterface) => {
  htmlTemplate = htmlTemplate.replace(
    /{{#if\s+([\s\S]+?)}}([\s\S]*?){{\/if}}/g,
    (_, condition, content) => {
      const evalCondition = new Function('params', `with(params) { return ${condition} }`)
      return evalCondition(params) ? content : ''
    }
  )

  htmlTemplate = htmlTemplate.replace(/{{\s*([\s\S]+?)\s*}}/g, (_, key) => {
    const evalKey = new Function('params', `with(params) { return ${key} }`)
    return evalKey(params) || ''
  })

  return htmlTemplate
}
