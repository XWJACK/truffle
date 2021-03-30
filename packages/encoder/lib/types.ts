import type { Provider } from "web3/providers";
import type { ContractObject as Artifact } from "@truffle/contract-schema/spec";
import type { Compilations, Format, Evm } from "@truffle/codec";
import type TruffleConfig from "@truffle/config";
import type * as Codec from "@truffle/codec";
import type * as Abi from "@truffle/abi-utils";

/**
 * This type contains options to be used when preparing transactions
 * or resolving overloads.  Currently the only allowed option is one for
 * whether to allow a transaction options argument on the end.
 * @Category Inputs
 */
export interface ResolveOptions {
  /**
   * This field, if set to true, allows an optional transaction options
   * argument after the other arguments.
   */
  allowOptions?: boolean;
}

/**
 * This type is a pair containing both a set of transaction options (as might
 * be sent to web3), including `data`, and an ABI for that transaction.  Only
 * function transactions are covered here at the moment, because this is meant
 * to be used with overload resolution as the return type.
 * @Category Inputs
 */
export interface TxAndAbi {
  /**
   * This field holds the transaction options.
   */
  tx: Codec.Options;
  /**
   * This field holds the ABI for the transaction.  Because this is intended
   * as a return type for overload resolution, only function ABI entries can go
   * here.
   */
  abi: Abi.FunctionEntry;
}

/**
 * @protected
 * @Category Inputs
 */
export interface EncoderInfoInternal {
  userDefinedTypes?: Format.Types.TypesById;
  allocations?: Evm.AllocationInfo;
  compilations?: Compilations.Compilation[];
  provider?: Provider;
  registryAddress?: string;
}

//WARNING: the following is copypasted from @truffle/decoder!!

/**
 * This type represents information about a Truffle project that can be used to
 * construct and initialize a encoder for that project.  This information may
 * be passed in various ways; this type is given here as an interface rather
 * than a union, but note that (aside from `ens`, which is special)
 * you only need to include one of these fields.  (The `compilations` field
 * will be used if present, then `artifacts` if not, then finally `config`.)
 * Further options for how to specify project information are intended to be
 * added in the future.
 *
 * There's also the `ens` field, which can be used to enable ENS resolution
 * when watching mapping keys.  In the future this will also be used for
 * ENS reverse resolution when decoding addresses.
 * @category Inputs
 */
export interface ProjectInfo {
  /**
   * An list of compilations, as specified in codec; this method of specifying
   * a project is mostly intended for internal Truffle use for now, but you can
   * see the documentation of the Compilations type if you want to use it.
   */
  compilations?: Compilations.Compilation[];
  /**
   * A list of contract artifacts for contracts in the project.
   * Contract constructor objects may be substituted for artifacts, so if
   * you're not sure which you're dealing with, it's OK.
   */
  artifacts?: Artifact[];
  /**
   * The project's config object.  If present, and it has the
   * `contracts_build_directory` property, the encoder will automatically read
   * all the artifacts from there and use those as the project information.
   * Further, smarter use of the config object are intended to be added in
   * the future.
   */
  config?: TruffleConfig;
  /**
   * This field can be included to enable or disable ENS resolution and specify
   * how it should be performed.
   * If absent, ENS resolution will not be activated.
   */
  ens?: EnsSettings;
}

/**
 * This type indicates settings to be used for ENS resolution.
 * @Category Inputs
 */
export interface EnsSettings {
  /**
   * The provider to use for ENS resolution; if set to `null` or left absent,
   * ENS resolution will not be activated.
   */
  provider?: Provider | null;
  /**
   * The ENS registry address to use; if absent, will use the default one
   * for the current network.  If there is no default registry for the
   * current network, ENS resolution will be disabled.
   */
  registryAddress?: string;
}

//HACK
export interface ContractConstructorObject extends Artifact {
  binary: string; //this exists as a getter
  deployed: () => Promise<ContractInstanceObject>;
}

//HACK
export interface ContractInstanceObject {
  constructor: ContractConstructorObject;
  address: string;
}