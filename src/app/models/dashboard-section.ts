export class DashboardSection {
    name: string;
    icon: string;
    path: string;
    role: string;
    constructor(name: string, icon: string,path: string, role:string) {
        this.name = name;
        this.icon = icon;
        this.path = path;
        this.role = role;
    }
    getNameWithId(id:string) {
        return this.name + ' / ' + id
    }
    getPathWithId(id:string) {
        return this.path + '/' + id
    }

}