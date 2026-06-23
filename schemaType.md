type Query {
  user: [User]
  event_user(where: EventUserWhere): [EventUser]
  group(where: GroupWhere): [Group]
  transaction_aggregate(where: TransactionWhere): TransactionAggregate
}


type user{
    login
    id
    auditRatio
    attrs
}
type EventUser {
  id
  level
  userId
  eventId
}
type EventUser {
  id
  level
  userId
  eventId
  }
  type Object {
  name: String
}
type Path {
  transactions: [Transaction]
}
type Transaction {
  type: String
  amount: Int
}

type MembersAggregate {
  team: [MemberNode]
  total_members: AggregateCount
}
type MemberNode {
  userLogin: String
}

type AggregateCount {
  count: Int
}

type TransactionAggregate {
  nodes: [TransactionNode]
}

type TransactionNode {
  type: String
  amount: Int
}