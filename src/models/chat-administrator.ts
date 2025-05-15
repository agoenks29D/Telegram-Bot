import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { ChatAdministratorRights } from 'telegraf/types';

interface ChatAdministratorAttributes {
  chatId: number;
  userId: number;
  firstName: string;
  lastName?: string;
  status: string;
  customData?: ChatAdministratorRights;
}

type ChatAdministratorCreationAttributes = Optional<
  ChatAdministratorAttributes,
  'lastName' | 'customData'
>;

@Table({
  tableName: 'chat_administrators',
  timestamps: false,
})
export class ChatAdministratorModel extends Model<
  ChatAdministratorAttributes,
  ChatAdministratorCreationAttributes
> {
  @Column(DataType.BIGINT)
  declare chatId: number;

  @Column(DataType.BIGINT)
  declare userId: number;

  @Column(DataType.STRING)
  declare firstName: string;

  @AllowNull
  @Column(DataType.STRING)
  declare lastName?: string;

  @Column(DataType.STRING)
  declare status: string;

  @AllowNull
  @Column(DataType.JSON)
  declare customData?: ChatAdministratorRights;
}
