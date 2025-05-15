import { Optional } from 'sequelize';
import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ChatMemberRestricted } from 'telegraf/types';

interface ChatAttributes {
  chatId: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  firstName?: string;
  lastName?: string;
  title?: string | null;
  status: 'available' | 'unavailable';
  restricted?: ChatMemberRestricted;
}

type ChatCreationAttributes = Optional<ChatAttributes, 'firstName' | 'lastName' | 'title'>;

@Table({
  tableName: 'chats',
  timestamps: false,
})
export class ChatModel extends Model<ChatAttributes, ChatCreationAttributes> {
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare chatId: number;

  @Column(DataType.STRING)
  declare type: 'private' | 'group' | 'supergroup' | 'channel';

  @Column(DataType.STRING)
  declare firstName?: string;

  @AllowNull
  @Column(DataType.STRING)
  declare lastName?: string;

  @AllowNull
  @Column(DataType.STRING)
  declare title?: string;

  @AllowNull
  @Column(DataType.JSON)
  declare restricted?: ChatMemberRestricted;

  @Column(DataType.STRING)
  declare status: string;
}
