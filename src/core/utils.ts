export const onlyUnique = <T extends any>(value:T, index:number, self:T[]) => self.indexOf(value) === index;
