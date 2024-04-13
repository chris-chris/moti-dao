import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { RewardLog } from "../generated/schema"
import { RewardLog as RewardLogEvent } from "../generated/SimpleERC6551Account/SimpleERC6551Account"
import { handleRewardLog } from "../src/simple-erc-6551-account"
import { createRewardLogEvent } from "./simple-erc-6551-account-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let org = "Example string value"
    let repo = "Example string value"
    let id = 123
    let commentCount = 123
    let commitCount = 123
    let tokenAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let rewardAmount = BigInt.fromI32(234)
    let newRewardLogEvent = createRewardLogEvent(
      org,
      repo,
      id,
      commentCount,
      commitCount,
      tokenAddress,
      rewardAmount
    )
    handleRewardLog(newRewardLogEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("RewardLog created and stored", () => {
    assert.entityCount("RewardLog", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "org",
      "Example string value"
    )
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "repo",
      "Example string value"
    )
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "commentCount",
      "123"
    )
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "commitCount",
      "123"
    )
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "RewardLog",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rewardAmount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
