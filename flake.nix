{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
	};

	outputs = { self, nixpkgs } @ inputs:
	let
		system = "x86_64-linux";
		
		pkgs = import inputs.nixpkgs{
			inherit system;
			config.allowUnfree = true;
			config.android_sdk.accept_license = true;
		};
		androidComposition = pkgs.androidenv.composeAndroidPackages {
			buildToolsVersions = [ "33.0.0" "34.0.0" "35.0.0" ];
			platformVersions = [ "35" "34" "33" ];
			abiVersions = [ "x86_64" ];
			includeEmulator = false;
			includeNDK = true;
			cmakeVersions = [ "3.22.1" ];
		};
		androidSdk = androidComposition.androidsdk;
	in 
	{
		devShells.${system}.default = pkgs.mkShell rec {
			name="Pyxis";
			ANDROID_HOME = "${androidSdk}/libexec/android-sdk";
			NDK_HOME = "${ANDROID_HOME}/ndk-bundle";
			GDK_BACKEND = "x11";
			GIO_MODULE_DIR = "${pkgs.glib-networking}/lib/gio/modules/";
			packages = with pkgs; [
				wrapGAppsHook4
				glib-networking
				pkg-config
				gobject-introspection
				rustup
				glib
				gtk3
				openssl_3
				cargo
				cargo-tauri
				nodejs
				at-spi2-atk
				atkmm
				cairo
				gdk-pixbuf
				glib
				gtk3
				harfbuzz
				librsvg
				libsoup_3
				pango
				webkitgtk_4_1
				openssl
			];
			shellHook = "tmux -L Pyxis new-session -A -t Pyxis";
		};
	};
}
