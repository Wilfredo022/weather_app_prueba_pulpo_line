import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Search } from "./Search";

vi.mock("../../stores/useDetailsStore", () => ({
  useWeatherStore: () => ({
    setWeatherData: vi.fn(),
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("../../services/apiClient");
vi.mock("../../services/search/searchCoordinates");

describe("Search Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSearch = () => {
    return render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
  };

  test("renders search input and button", () => {
    renderSearch();

    expect(
      screen.getByPlaceholderText("search.placeholder")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("shows error when searching empty query", async () => {
    renderSearch();
    const button = screen.getByRole("button");
    const user = userEvent.setup();

    await user.click(button);

    expect(screen.getByText("search.emptyField")).toBeInTheDocument();
  });
});
