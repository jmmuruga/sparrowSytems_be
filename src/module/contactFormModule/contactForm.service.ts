import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { ContactFormDto, ContactFormDtoValidation } from "./contactForm.dto";
import { contactDetails } from "./contactForm.model";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const addContactFormDetails = async (req: Request, res: Response) => {
  const payload: ContactFormDto = req.body;
  const contactFormRepository = appSource.getRepository(contactDetails);

  try {
    // Validate input using your DTO validation schema
    const validation = ContactFormDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    // Save validated data to DB
    await contactFormRepository.save(payload);

    return res.status(200).send({
      message: "Contact form submitted successfully",
    });

  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }

    console.error("Contact form save error:", error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

// export const sendMail = async (req: Request, res: Response) => {
//   try {
//     const { customer_name, customer_company, mobileNumber, e_mail, message } = req.body;

//     console.log(req.body, "email service called");

//     const repo = appSource.getRepository(contactDetails);

//     const savedData = repo.create({
//       customer_name,
//       customer_company,
//       mobileNumber,
//       e_mail,
//       message,
//     });

//     await repo.save(savedData);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "support@sparrowsystems.in",
//         pass: "mqks tltb abyk jlyw", // Consider using environment variable
//       },
//     });

//     await transporter.sendMail({
//       from: "support@sparrowsystems.in",
//       to: "savedataakshaya03@gmail.com",
//       subject: `New Inquiry from ${customer_name}`,
//       html: `
//         <h2>New Inquiry Received</h2>
//         <p><strong>Name:</strong> ${customer_name}</p>
//         <p><strong>Company:</strong> ${customer_company}</p>
//         <p><strong>Phone:</strong> ${mobileNumber}</p>
//         <p><strong>Email:</strong> ${e_mail}</p>
//         <p><strong>Message:</strong><br>${message}</p>
//       `,
//     });

//     res.status(200).send({
//       Result: "Mail sent and data saved successfully",
//     });

//   } catch (error) {
//     console.error("Mail Error:", error);

//     res.status(500).send({
//       message: "Internal Server Error",
//     //   error: error.message,
//     });
//   }
// };

export const sendMail = async (req: Request, res: Response) => {
  try {
    const { name, company, phone, email, query } = req.body;

    // Map frontend fields to DB entity fields
    const contactFormRepository = appSource.getRepository(contactDetails);
    const formEntry = contactFormRepository.create({
      customer_name: name,
      customer_company: company,
      mobileNumber: phone,
      e_mail: email,
      message: query,
    });

    await contactFormRepository.save(formEntry);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "savedataakshaya03@gmail.com",
        pass: "xyvs iqyg bonl mtjr", // Ideally store in .env
      },
    });

    await transporter.sendMail({
      from: "support@sparrowsystems.in",
      to: "savedataakshaya03@gmail.com",
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${query}</p>
      `,
    });

    return res.status(200).send({
      message: "Form submitted and mail sent successfully",
    });
  } catch (error) {
    console.error("Mail Error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

