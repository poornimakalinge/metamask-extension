export enum ConnectAccountsType {
  Account = 'disconnectAllAccountsText',
  Snap = 'disconnectAllSnapsText',
}

export interface AccountType {
  name: string;
  address: string;
  balance: string;
  keyring: KeyringType;
  label?: string;
}

export interface KeyringType {
  type: string;
}

export interface ConnectAccountsListProps {
  onClose: () => void;
  allAreSelected: () => boolean;
  deselectAll: () => void;
  selectAll: () => void;
  handleAccountClick: (address: string) => void;
  selectedAccounts: string[];
  accounts: AccountType[];
  checked: boolean;
  isIndeterminate: boolean;
}