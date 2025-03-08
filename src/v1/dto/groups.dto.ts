export class GroupsDto {
  id: number;
  groupname: string;
  active: number;
  create_at: Date;
  create_userid: number;
  update_at?: Date;
  update_userid?: number;
  delete_at?: Date;
  delete_userid?: number;
}
