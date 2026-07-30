/**
 * Availability line.
 *
 * This used to read a remaining-spots number from a spreadsheet cell and render
 * "נותרו N מקומות החודש". A mechanism that needs a human to update it weekly
 * fails eventually, and when it fails it states a false number, so last
 * session's fix made it fail safely instead. That was solving the wrong problem:
 * the manual field itself was the defect.
 *
 * What is left is a standing capacity statement, which needs no maintenance and
 * cannot go stale. There is no countdown and no number that shrinks as the month
 * goes on: an availability figure the visitor cannot check, driven by a cell
 * nobody watches, is manufactured pressure.
 *
 * Replacing this with a real availability signal needs a source the site does
 * not have today, either the booking calendar or a stated cohort cadence. Until
 * one exists, a sentence that is simply true is the honest maximum.
 */
type SpotsLeftProps = { className?: string };

const SpotsLeft = ({ className = "" }: SpotsLeftProps) => (
  <p className={className}>אני לוקח עד 10 לקוחות בחודש.</p>
);

export default SpotsLeft;
