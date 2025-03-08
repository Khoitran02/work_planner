export class GroupsMemberDto {
  id: number;
  groupId: number;
  userId: number;
  active: number;
  create_at: Date;
  update_at?: Date | null;
  update_userid?: number | null;
  delete_at?: Date | null;
  delete_userid?: number | null;
}
