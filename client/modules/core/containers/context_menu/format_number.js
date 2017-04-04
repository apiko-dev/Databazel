import { useDeps } from 'mantra-core';
import FormatNumberItem from '../../components/context_menu/format_number.jsx';

export const depsMapper = (context, actions) => ({
  updateSelectedField: actions.workplaceState.updateSelectedField,
  context: () => context,
});

export default useDeps(depsMapper)(FormatNumberItem);
