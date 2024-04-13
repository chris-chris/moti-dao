import {
  RewardLog as RewardLogEvent,
  TransactionExecuted as TransactionExecutedEvent,
  WithdrawTokenLog as WithdrawTokenLogEvent
} from "../generated/SimpleERC6551Account/SimpleERC6551Account"
import {
  RewardLog,
  TransactionExecuted,
  WithdrawTokenLog
} from "../generated/schema"

export function handleRewardLog(event: RewardLogEvent): void {
  let entity = new RewardLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.org = event.params.org
  entity.repo = event.params.repo
  entity.SimpleERC6551Account_id = event.params.id
  entity.commentCount = event.params.commentCount
  entity.commitCount = event.params.commitCount
  entity.tokenAddress = event.params.tokenAddress
  entity.rewardAmount = event.params.rewardAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransactionExecuted(
  event: TransactionExecutedEvent
): void {
  let entity = new TransactionExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.target = event.params.target
  entity.value = event.params.value
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawTokenLog(event: WithdrawTokenLogEvent): void {
  let entity = new WithdrawTokenLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenAddress = event.params.tokenAddress
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
