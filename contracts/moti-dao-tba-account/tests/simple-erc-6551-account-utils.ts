import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  RewardLog,
  TransactionExecuted,
  WithdrawTokenLog
} from "../generated/SimpleERC6551Account/SimpleERC6551Account"

export function createRewardLogEvent(
  org: string,
  repo: string,
  id: BigInt,
  commentCount: BigInt,
  commitCount: BigInt,
  tokenAddress: Address,
  rewardAmount: BigInt
): RewardLog {
  let rewardLogEvent = changetype<RewardLog>(newMockEvent())

  rewardLogEvent.parameters = new Array()

  rewardLogEvent.parameters.push(
    new ethereum.EventParam("org", ethereum.Value.fromString(org))
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam("repo", ethereum.Value.fromString(repo))
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam(
      "commentCount",
      ethereum.Value.fromUnsignedBigInt(commentCount)
    )
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam(
      "commitCount",
      ethereum.Value.fromUnsignedBigInt(commitCount)
    )
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  rewardLogEvent.parameters.push(
    new ethereum.EventParam(
      "rewardAmount",
      ethereum.Value.fromUnsignedBigInt(rewardAmount)
    )
  )

  return rewardLogEvent
}

export function createTransactionExecutedEvent(
  target: Address,
  value: BigInt,
  data: Bytes
): TransactionExecuted {
  let transactionExecutedEvent = changetype<TransactionExecuted>(newMockEvent())

  transactionExecutedEvent.parameters = new Array()

  transactionExecutedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromAddress(target))
  )
  transactionExecutedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  transactionExecutedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return transactionExecutedEvent
}

export function createWithdrawTokenLogEvent(
  tokenAddress: Address,
  to: Address,
  amount: BigInt
): WithdrawTokenLog {
  let withdrawTokenLogEvent = changetype<WithdrawTokenLog>(newMockEvent())

  withdrawTokenLogEvent.parameters = new Array()

  withdrawTokenLogEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  withdrawTokenLogEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawTokenLogEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawTokenLogEvent
}
