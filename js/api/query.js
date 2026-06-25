const token = localStorage.getItem("token");

export const getData = async () => {
  try {
    const response = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

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


const query = `
query {
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