export type VarType = 'number' | 'string' | 'date' | 'boolean' | 'options';

export class VarOption {
  id!: number;
  name!: string;
}

export class UserDataType {
  id!: number;
  varTypeName!: string;
  varType!: VarType;
}

export class UserDataQuestion {
  id!: number;
  name!: string;
  variableType!: UserDataType;
  required!: boolean;
  answer: any;
  options: VarOption[] = [];
}

export class UserQuizSession {
  index!: number;
  questions: UserDataQuestion[] = [];
}
