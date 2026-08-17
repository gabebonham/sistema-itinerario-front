export class DashboardSection {
    name: string;
    icon: string;
    path: string;
    roles: string[];
    constructor(name: string, icon: string,path: string, roles:string[]) {
        this.name = name;
        this.icon = icon;
        this.path = path;
        this.roles = roles;
    }
    getNameWithId(id:string) {
        return this.name + ' / ' + id
    }
    getPathWithId(id:string) {
        return this.path + '/' + id
    }

}