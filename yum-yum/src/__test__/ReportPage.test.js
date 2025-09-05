
import { describe, expect, test } from '@jest/globals';
import { render, screen } from "@testing-library/react";
import ReportPage from '../pages/report/ReportPage';

describe('테스트 문', () => {
  test('최초 제목이 잘 나오는지 테스트', async () => {
    render(<ReportPage />)

    const reportTitle = await screen.getByText("ReportPage");
    expect(reportTitle.tagName).toBe("P")
  });
});
