export const getData = async (userId) => {
  try {
    const response = await fetch(
      "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            userId: Number(userId),
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


const QUERY = `
query ($userId: Int!) {
  user {
    id
    login
    auditRatio
    totalDown
    totalUp
    attrs

    success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      aggregate { count }
    }

    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      aggregate { count }
    }

    cohort: events(where: {cohorts: {labelName: {_is_null: false}}}) {
      cohorts {
        labelName
      }
    }
  }

transactions: transaction(
  where: {
    type: { _eq: "xp" }
    event: { object: { name: { _eq: "Module" } } }
  }
      order_by: {
    createdAt: asc
  }
) {
  createdAt
  amount
  objectId
  project: object {
    name
    type
  }
}

  groups_per_project: group(
    where: {
      members: { userId: { _eq: $userId } }
      eventId: { _eq: 41 }
      _and: {
        members: { userId: { _eq: $userId }, accepted: { _eq: true } }
      }
    }
          order_by: {
    createdAt: asc
  }
  ) {
   
    name_project: object {
      name
      type
      
    }
 

    xp_per_project: pathByPath {
      transactions(where: { type: { _eq: "xp" } }) {
        type
        amount
        createdAt
      }
    }

    members_aggregate {
      team: nodes {
        userLogin
      }
      total_members: aggregate {
        count
      }
    }
  }

  totalXP: transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate { sum { amount } }
  }

  lvl: transaction_aggregate(
    where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate { max { amount } }
  }

  skills: transaction(
    where: { type: { _ilike: "%skill%" } }
    order_by: { amount: desc }
  ) {
    type
    amount
  }
}
`;