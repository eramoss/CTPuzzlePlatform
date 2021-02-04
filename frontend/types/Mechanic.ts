export default class Mechanic {
  id: number = 0
  name: string= ''
  description: string= ''
  classDefinition:string = ''
  responseClassDefinition:string = ''
  scoreFunction:string = ''

  constructor(name: string, description: string, classDefinition: string, responseClassDefinition: string, scoreFunction: string) {
    this.name = name;
    this.description = description;
    this.classDefinition = classDefinition;
    this.responseClassDefinition = responseClassDefinition;
    this.scoreFunction = scoreFunction;
  }
}
