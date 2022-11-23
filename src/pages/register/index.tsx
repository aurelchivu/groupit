import { Checkbox, Label, TextInput, Button } from "flowbite-react";
import { type NextPage } from "next";
import Link from "next/link";

const Register: NextPage = () => {
  return (
    <div className="my-40 mx-1 flex items-center justify-center">
      <form className="flex flex-col gap-5">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
            required={true}
            shadow={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2" value="Your password" />
          </div>
          <TextInput
            id="password2"
            type="password"
            required={true}
            shadow={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password" value="Repeat password" />
          </div>
          <TextInput
            id="repeat-password"
            type="password"
            required={true}
            shadow={true}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree">
            I agree with the{" "}
            <Link
              href="/groups"
              className="text-red-600 hover:underline dark:text-blue-500"
            >
              terms and conditions
            </Link>
          </Label>
        </div>
        <Button className="mx-20" type="submit">
          Register new account
        </Button>
      </form>
    </div>
  );
};

export default Register;
