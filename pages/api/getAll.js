import group from "@/models/group";
import installment from "@/models/installment";
import loan from "@/models/loan";
import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      // Counts
      // Customers Count
      var customers = await Customer.countDocuments({});
      // Loans Count
      var loans = await loan.countDocuments({});
      // Installments Count
      var installments = await installment.countDocuments({});
      // Groups Count
      var groups = await group.countDocuments({});

      // Total
      // Total Money Distributed
      var loansSum = await loan.aggregate([
        { $group: { _id: null, amount: { $sum: "$loanAmount" } } },
      ]);
      // Total Money Collected
      var installmentsSum = await installment.aggregate([
        { $group: { _id: null, amount: { $sum: "$installment" } } },
      ]);
      // Total Interest Collected
      var NFInterestSum = await loan.aggregate([
        { $group: { _id: null, amount: { $sum: "$interest" } } },
      ]);
      // Total Fees Collected
      var chargesSum = await loan.aggregate([
        { $group: { _id: null, amount: { $sum: "$charges" } } },
      ]);

      // Counts
      // 10 Weeks NF Count
      var tenWeeksNF = await loan.countDocuments({ count: 10 });
      // 100 Days NF Count
      var hundredDaysNF = await loan.countDocuments({ count: 100 });
      // 52 Weeks BC Count
      var fiftyTwoWeeksBC = await loan.countDocuments({ count: 52 });
      // 20 Months BC Count
      var twentyMonthsBC = await loan.countDocuments({ count: 20 });
      // 17 Months BC Count
      var seventeenMonthsBC = await loan.countDocuments({ count: 17 });
      // 12 Months BC Count
      var twelveMonthsBC = await loan.countDocuments({ count: 12 });

      var BCInterestSum = await installment.aggregate([
        { $group: { _id: null, amount: { $sum: "$interest" } } },
      ]);

      var totalBC = await loan.find({
        $or: [{ count: 12 }, { count: 52 }, { count: 17 }, { count: 20 }],
      });
      var totalNF = await loan.find({ $or: [{ count: 10 }, { count: 100 }] });

      var NFFineSum = await installment.aggregate([
        {
          $lookup: {
            from: "loans",
            localField: "loan",
            foreignField: "id",
            as: "loanDetails",
          },
        },
        {
          $unwind: "$loanDetails",
        },
        {
          $group: {
            _id: "$loanDetails.count",
            amount: { $sum: "$fine" },
          },
        },
      ]);

      const data = [
        {
          label: "Total Customers Count",
          stats: customers,
          progress: 100,
          color: "teal",
          icon: "users",
        },
        {
          label: "Total Loans Count",
          stats: loans,
          progress: 100,
          color: "blue",
          icon: "currency",
        },
        {
          label: "Total Installments Count",
          stats: installments,
          progress: 100,
          color: "red",
          icon: "ruppee",
        },
        {
          label: "Total Groups Count",
          stats: groups,
          progress: 100,
          color: "teal",
          icon: "bank",
        },
        {
          label: "Total Money Distributed",
          stats: loansSum[0]?.amount || 0,
          progress: 100,
          color: "lime",
          icon: "currency",
        },
        {
          label: "Total Money Collected",
          stats: installmentsSum[0]?.amount || 0,
          progress: 100,
          color: "pink",
          icon: "ruppee",
        },
        {
          label: "Total Interest Collected",
          stats: NFInterestSum[0]?.amount || 0,
          progress: 100,
          color: "grape",
          icon: "ruppee",
        },
        {
          label: "Total Fees Collected",
          stats: chargesSum[0]?.amount || 0,
          progress: 100,
          color: "violet",
          icon: "ruppee",
        },
        {
          label: "10 Weeks N.F. Count",
          stats: tenWeeksNF,
          progress: 100,
          color: "green",
          icon: "number",
        },
        {
          label: "100 Days N.F. Count",
          stats: hundredDaysNF,
          progress: 100,
          color: "yellow",
          icon: "number",
        },
        {
          label: "17 Months N.F. Count",
          stats: seventeenMonthsBC,
          progress: 100,
          color: "green",
          icon: "number",
        },
        {
          label: "12 Months N.F. Count",
          stats: twelveMonthsBC,
          progress: 100,
          color: "orange",
          icon: "number",
        },
        {
          label: "52 Weeks B.C. Count",
          stats: fiftyTwoWeeksBC,
          progress: 100,
          color: "indigo",
          icon: "number",
        },
        {
          label: "20 Month B.C. Count",
          stats: twentyMonthsBC,
          progress: 100,
          color: "cyan",
          icon: "number",
        },
        {
          label: "Total B.C. Count",
          stats: totalBC?.length,
          progress: 100,
          color: "dark",
          icon: "number",
        },
        {
          label: "Total N.F. Count",
          stats: totalNF?.length,
          progress: 100,
          color: "gray",
          icon: "number",
        },
        {
          label: "Total B.C. Interest",
          stats: BCInterestSum[0]?.amount || 0,
          progress: 100,
          color: "pink",
          icon: "number",
        },
      ];

      const colors = [
        "green",
        "violet",
        "pink",
        "teal",
        "yellow",
        "red",
        "blue",
        "orange",
      ];

      const fine = NFFineSum.map((item, index) => {
        return {
          label: item._id + " Installments - Fine",
          stats: item.amount,
          progress: 100,
          color: colors[index],
          icon: "currency",
        };
      });

      return res.status(200).json({
        error: false,
        ok: true,
        data: [...data, ...fine],
        message: "Customers fetched successfully",
        // NFFineSum,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching loans",
      });
    }
  }
};

export default connectDB(handler);
