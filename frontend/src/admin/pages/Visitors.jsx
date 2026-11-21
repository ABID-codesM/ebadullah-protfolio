import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import "../styles/Visitors.css";

import api from "../../services/api";

import VisitorsOverview from "../components/visitors/VisitorsOverview";
import VisitorsFilters from "../components/visitors/VisitorsFilters";
import VisitorsTable from "../components/visitors/VisitorsTable";
import VisitorDetails from "../components/visitors/VisitorDetails";

const initialFilters = {
  search: "",
  visitorType: "",
  device: "",
  browser: "",
  os: "",
  startDate: "",
  endDate: "",
};

const Visitors = () => {
  const [overview, setOverview] = useState(null);
  const [visitors, setVisitors] = useState([]);

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState(initialFilters);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [sort, setSort] = useState("last_seen");
  const [order, setOrder] = useState("desc");

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorDetails, setVisitorDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Overview API
  const fetchOverview = useCallback(async () => {
    try {
      setLoadingOverview(true);

      const response = await api.get("/visitors/admin/overview");

      setOverview(response.data?.data || null);
    } catch (error) {
      console.error("Visitors overview error:", error);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  // Visitors list API
  const fetchVisitors = useCallback(async () => {
    try {
      setLoadingVisitors(true);

      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sort,
        order,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] == null) {
          delete params[key];
        }
      });

      const response = await api.get("/visitors/admin", {
        params,
      });

      const result = response.data;

      setVisitors(result?.data || []);

      if (result?.pagination) {
        setPagination((previous) => ({
          ...previous,
          ...result.pagination,
        }));
      }
    } catch (error) {
      console.error("Visitors list error:", error);
      setVisitors([]);
    } finally {
      setLoadingVisitors(false);
    }
  }, [filters, pagination.page, pagination.limit, sort, order]);

  // Initial overview
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Visitors list
  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Filters
  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  // Reset
  const handleReset = () => {
    setFilters(initialFilters);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    setSort("last_seen");
    setOrder("desc");
  };

  // Sorting
  const handleSort = (column) => {
    if (sort === column) {
      setOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSort(column);
      setOrder("asc");
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    setPagination((previous) => ({
      ...previous,
      page,
    }));
  };

  // Visitor details
  const handleViewVisitor = async (visitor) => {
    setSelectedVisitor(visitor);
    setVisitorDetails(null);

    try {
      setLoadingDetails(true);

      const response = await api.get(
        `/visitors/admin/${visitor.id || visitor.visitor_id}`,
      );

      setVisitorDetails(response.data?.data || null);
    } catch (error) {
      console.error("Visitor details error:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedVisitor(null);
    setVisitorDetails(null);
  };

  // Refresh all
  const handleRefresh = async () => {
    setRefreshing(true);

    await Promise.all([fetchOverview(), fetchVisitors()]);

    setRefreshing(false);
  };

  return (
    <div className="admin-visitors-page">
      {/* Page Header */}
      <div className="visitors-page-header">
        <div>
          <span className="visitors-page-eyebrow">ANALYTICS</span>

          <h1>Website Visitors</h1>

          <p>
            Monitor traffic, understand visitor behavior, and explore activity
            across your website.
          </p>
        </div>

        <button
          type="button"
          className="visitors-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "refresh-spinning" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Overview */}
      <VisitorsOverview data={overview} loading={loadingOverview} />

      {/* Filters */}
      <VisitorsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Table */}
      <VisitorsTable
        visitors={visitors}
        loading={loadingVisitors}
        pagination={pagination}
        sort={sort}
        order={order}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onView={handleViewVisitor}
      />

      {/* Details */}
      {selectedVisitor && (
        <VisitorDetails
          visitor={selectedVisitor}
          details={visitorDetails}
          loading={loadingDetails}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Visitors;
